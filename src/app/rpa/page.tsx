'use client';
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from 'react';

export default function Rpa() {
  const { user, isLoading: authLoading } = useUser();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [formFields, setFormFields] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const options = ['Selecione uma automação', '1. Download PDF Católica', '2. Relatório FIPE', '3. Consulta CNPJs'];
  
  const getOpacity = (isLoading: boolean) => (isLoading ? 0.5 : 1);
  const getCursor = (isLoading: boolean) => (isLoading ? 'not-allowed' : 'pointer');

  useEffect(() => {
    if (!user && !authLoading) {
      alert("Você precisa estar logado para acessar essa página.");
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (selectedOption) {
      sessionStorage.setItem('selectedOption', selectedOption);
      sessionStorage.setItem('formFields', JSON.stringify(formFields));
      sessionStorage.setItem('message', message || '');
    }
  }, [selectedOption, formFields, message]);
  
  useEffect(() => {
    const savedLoading = sessionStorage.getItem('isLoading');
    if (savedLoading === 'true') {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }

    const savedOption = sessionStorage.getItem('selectedOption');
    const savedFields = sessionStorage.getItem('formFields');
    const savedMessage = sessionStorage.getItem('message');

    if (savedOption) {
      setSelectedOption(savedOption);
    }
    if (savedFields) {
      setFormFields(JSON.parse(savedFields));
    }
    if (savedMessage) {
      setMessage(savedMessage);
    }
  }, []);

  if (authLoading) {
    return <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-20 pb-20 gap-16 sm:p-20 text-2xl font-[family-name:var(--font-geist-sans)]">Carregando...</div>;
  }

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelection = (option: string) => {
    setSelectedOption(option);

    if (option === 'Selecione uma automação') {
      setFormFields({});
    } else if (option === '1. Download PDF Católica') {
      setFormFields({ user: '', password: '' });
    } else if (option === '2. Relatório FIPE') {
      setFormFields({ mes: '' });
    } else if (option === '3. Consulta CNPJs') {
      setFormFields({  });
      setFile(null);
    }

    setIsOpen(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormFields(prevFields => ({
      ...prevFields,
      [field]: value
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
  
    if (selectedFile) {
      const validMimeTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ];
  
      const isValidFileType =
        validMimeTypes.includes(selectedFile.type) ||
        selectedFile.name.toLowerCase().endsWith('.xlsx');
  
      if (!isValidFileType) {
        setMessage('Erro: O arquivo deve ser do tipo .xlsx.');
  
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
  
        setFile(null);
        return;
      }
  
      setFile(selectedFile);
      setMessage('Arquivo anexado com sucesso.');
    }
  };  

  const handleExecute = async () => {
    if (!user?.email) {
      setMessage('Erro: E-mail do usuário não encontrado.');
      return;
    }
  
    const requiredFields =
      selectedOption === '1. Download PDF Católica'
        ? ['user', 'password']
        : selectedOption === '2. Relatório FIPE'
        ? ['mes']
        : selectedOption === '3. Consulta CNPJs'
        ? ['file']
        : [];
  
    const emptyFields = requiredFields.filter((field) => {
      if (field === 'file') {
        return !file;
      }
      return !formFields[field];
    });
  
    if (emptyFields.length > 0) {
      setMessage('Aviso: Não devem haver campos vazios.');
      return;
    }
  
    const url = `${process.env.NEXT_PUBLIC_API_URL}/executar`;
    const formData = new FormData();
    formData.append('opcao', selectedOption);
    formData.append('userEmail', user.email);
  
    if (selectedOption === '1. Download PDF Católica') {
      formData.append('user', formFields.user || '');
      formData.append('password', formFields.password || '');
    } else if (selectedOption === '2. Relatório FIPE') {
      formData.append('mes', formFields.mes || '');
    } else if (selectedOption === '3. Consulta CNPJs' && file) {
      formData.append('file', file);
    }
  
    try {
      setIsLoading(true);
  
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Email': user.email,
        },
        body: formData,
      });
  
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.mensagem || 'Erro ao executar a automação.');
      }
  
      setMessage(responseData.mensagem || 'Automação executada com sucesso.');
    } catch (error) {
      setMessage(`Erro ao executar a automação: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };  

  setTimeout(() => {
    setMessage(null);
  }, 5000);

  if (user) {
    return (
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-20 pb-20 font-[family-name:var(--font-geist-mono)]">
        <div className="mt-4 flex flex-col gap-8 row-start-4 items-center justify-center sm:items-start" style={{ position: 'relative', display: 'inline-block', userSelect: 'none' }}>
        <button
          className="text-2xl"
          onClick={toggleDropdown}
          disabled={isLoading}
          style={{
            cursor: getCursor(isLoading),
            padding: '10px',
            border: '1px solid',
            borderRadius: '4px',
            width: '500px',
            textAlign: 'center',
            opacity: getOpacity(isLoading),
          }}
        >
          {selectedOption ? selectedOption : 'Selecione uma automação'}
          <span style={{ marginLeft: '16px' }}>
            {isOpen ? '▲' : '▼'}
          </span>
        </button>

          {isOpen && (
            <ul className="flex flex-col row-start-4 items-center justify-center sm:items-start text-1xl"
                style=
                {{
                  top: '100%',
                  left: '0',
                  marginTop: '4px',
                  padding: '0',
                  listStyle: 'none',
                  border: '1px solid',
                  borderRadius: '4px',
                  width: '100%'
                  }}>
                {options.map((option) => (
                <li
                  key={option}
                  onClick={() => handleSelection(option)}
                  style=
                  {{
                    padding: '6px',
                    cursor: 'pointer',
                    width: '100%',
                    boxSizing: 'border-box',
                    textAlign: 'center',
                    transition: 'all 200ms ease-in-out'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--foreground)';
                    e.currentTarget.style.color = 'var(--background)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--background)';
                    e.currentTarget.style.color = 'var(--foreground)';
                  }}
                >
                  {option}
                </li>
              ))}
            </ul>
          )}

          {selectedOption && selectedOption !== 'Selecione uma automação' && (
            <>
              <p
                className="row-start-5 p-8"
                style=
                {{
                  userSelect: 'none',
                  textAlign: 'center'
                }}
              >
                Insira os parâmetros da automação:
              </p>

              {selectedOption === '1. Download PDF Católica' && (
                <div className="flex flex-col grid row-start-6 items-center justify-center"
                     style=
                     {{
                        width: '100%'
                      }}>
                  <form className="flex flex-col grid row-start-6 items-center justify-center">
                    <input
                      type="text"
                      placeholder="Usuário Católica"
                      autoComplete="off"
                      className="input-field"
                      style=
                      {{
                        marginBottom: '10px',
                        padding: '8px',
                        width: '100%',
                        borderRadius: '4px',
                        backgroundColor: 'var(--background)',
                        color: 'var(--foreground)',
                        border: '2px solid var(--foreground)',
                        opacity: getOpacity(isLoading)
                      }}
                      value={formFields.user || ''}
                      onChange={(e) => handleInputChange('user', e.target.value)}
                      disabled={isLoading}
                    />
                    <input
                      type="password"
                      placeholder="Senha Católica"
                      autoComplete="off"
                      className="input-field"
                      style=
                      {{
                        padding: '8px',
                        width: '100%',
                        borderRadius: '4px',
                        backgroundColor: 'var(--background)',
                        color: 'var(--foreground)',
                        border: '2px solid var(--foreground)',
                        opacity: getOpacity(isLoading)
                      }}
                      value={formFields.password || ''}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      disabled={isLoading}
                    />
                  </form>
                </div>
              )}

              {selectedOption === '2. Relatório FIPE' && (
                <div className="flex flex-col grid row-start-6 items-center justify-center" style={{ width: '100%' }}>
                  <form className="flex flex-col grid row-start-6 items-center justify-center">
                    <input 
                      type="text"
                      placeholder="Mês Referência (MM/yyyy)"
                      autoComplete="off"
                      className="input-field"
                      style={{
                        marginBottom: '10px',
                        padding: '8px',
                        width: '100%',
                        borderRadius: '4px',
                        backgroundColor: 'var(--background)',
                        color: 'var(--foreground)',
                        border: '2px solid var(--foreground)',
                        opacity: getOpacity(isLoading)
                      }}
                      value={formFields.mes || ''}
                      onChange={(e) => handleInputChange('mes', e.target.value)}
                      disabled={isLoading}
                    />
                  </form>
                </div>
              )}

              {selectedOption === '3. Consulta CNPJs' && (
                <div className="flex flex-col grid row-start-6 items-center justify-center" style={{ width: '100%' }}>
                  <form className="flex flex-col grid row-start-6 items-center justify-center">
                    {!file ? (
                      <input
                      ref={fileInputRef}
                      type="file"
                      accept=".xlsx"
                      className="input-field"
                      style={{
                        marginBottom: '10px',
                        padding: '8px',
                        width: '100%',
                        borderRadius: '4px',
                        backgroundColor: 'var(--background)',
                        color: 'var(--foreground)',
                        border: '2px solid var(--foreground)',
                        opacity: getOpacity(isLoading),
                        cursor: getCursor(isLoading)
                      }}
                      onChange={handleFileChange}
                      disabled={isLoading}
                    />                    
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ marginRight: '10px', color: 'var(--foreground)' }}>
                          {file.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => setFile(null)}
                          style={{
                            color: 'red',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            border: 'none',
                            background: 'transparent',
                            fontSize: '20px',
                          }}
                          disabled={isLoading}
                        >
                          ✖
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              )}
            </>
          )}
        </div>
        
        {selectedOption && selectedOption !== 'Selecione uma automação' && (
          <button
            className="row-start-7"
            onClick={handleExecute}
            style=
            {{
                marginTop: '30px',
                padding: '10px 20px',
                backgroundColor: 'var(--foreground)',
                color: 'var(--background)',
                border: 'none',
                borderRadius: '4px',
                cursor: getCursor(isLoading),
                fontSize: '16px',
                userSelect: 'none',
                opacity: getOpacity(isLoading)
            }}
            disabled={isLoading}
          >
            Executar
          </button>
        )}

        {isLoading && (
          <div className="loading-spinner row-start-8 p-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              style={{ margin: "auto", display: "block" }}
              width="50px"
              height="50px"
              viewBox="0 0 100 100"
              preserveAspectRatio="xMidYMid"
            >
              <circle
                cx="50"
                cy="50"
                r="32"
                strokeWidth="8"
                stroke="var(--foreground)"
                strokeDasharray="50.26548245743669 50.26548245743669"
                fill="none"
                strokeLinecap="round"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  repeatCount="indefinite"
                  dur="1s"
                  keyTimes="0;1"
                  values="0 50 50;360 50 50"
                ></animateTransform>
              </circle>
            </svg>
          </div>
        )}

        {message && (
          <div
          className="row-start-9"
          style=
          {{
              marginTop: '20px',
              padding: '10px',
              backgroundColor: message.toLowerCase().startsWith('erro') ? 'red' : message.toLowerCase().startsWith('aviso') ? 'yellow' : 'green',
              color: 'black',
              borderRadius: '4px',
              textAlign: 'center',
              border: '2px solid var(--foreground)'
            }}
          >
            {message}
          </div>
        )}
      </div>
    );
  }

  return null;
}
